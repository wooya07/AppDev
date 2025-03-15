from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import pandas as pd
import os
import jwt
from jose import JWTError, jwt
from passlib.context import CryptContext

# 데이터베이스 설정
SQLALCHEMY_DATABASE_URL = "sqlite:///./attendance.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# JWT 설정
SECRET_KEY = "your-secret-key"  # 실제 환경에서는 환경 변수로 관리하세요
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 비밀번호 해싱
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 설정
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# 데이터베이스 모델
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    role = Column(String)  # admin, teacher, student
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 관계 설정
    student = relationship("Student", back_populates="user", uselist=False)
    teacher = relationship("Teacher", back_populates="user", uselist=False)

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    student_id = Column(String, unique=True, index=True)
    grade = Column(String)
    class_number = Column(String)
    number = Column(Integer)
    
    user = relationship("User", back_populates="student")
    attendance_details = relationship("AttendanceDetail", back_populates="student")

class Teacher(Base):
    __tablename__ = "teachers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    teacher_id = Column(String, unique=True, index=True)
    grade = Column(String)
    class_number = Column(String)
    
    user = relationship("User", back_populates="teacher")
    approved_attendances = relationship("Attendance", back_populates="approved_by")

class Class(Base):
    __tablename__ = "classes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    grade = Column(String)
    class_number = Column(String)
    total_students = Column(Integer, default=0)
    
    attendances = relationship("Attendance", back_populates="class_")

class Attendance(Base):
    __tablename__ = "attendances"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime)
    period = Column(String)  # period1, period2, period3
    class_id = Column(Integer, ForeignKey("classes.id"))
    submitted_by_id = Column(Integer, ForeignKey("students.id"))
    approved_by_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)
    status = Column(String, default="PENDING")  # PENDING, APPROVED, REJECTED
    total_students = Column(Integer)
    present_count = Column(Integer)
    
    class_ = relationship("Class", back_populates="attendances")
    approved_by = relationship("Teacher", back_populates="approved_attendances")
    attendance_details = relationship("AttendanceDetail", back_populates="attendance")

class AttendanceDetail(Base):
    __tablename__ = "attendance_details"
    
    id = Column(Integer, primary_key=True, index=True)
    attendance_id = Column(Integer, ForeignKey("attendances.id"))
    student_id = Column(Integer, ForeignKey("students.id"))
    period1_present = Column(Boolean, default=True)
    period1_reason = Column(String, nullable=True)
    period2_present = Column(Boolean, default=True)
    period2_reason = Column(String, nullable=True)
    period3_present = Column(Boolean, default=True)
    period3_reason = Column(String, nullable=True)
    
    attendance = relationship("Attendance", back_populates="attendance_details")
    student = relationship("Student", back_populates="attendance_details")

# 데이터베이스 생성
Base.metadata.create_all(bind=engine)

# Pydantic 모델
class UserCreate(BaseModel):
    user_id: str
    password: str
    name: str
    role: str

class UserLogin(BaseModel):
    userId: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

# 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 유틸리티 함수
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.user_id == user_id).first()

def authenticate_user(db: Session, user_id: str, password: str):
    user = get_user(db, user_id)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception
    user = get_user(db, user_id=token_data.user_id)
    if user is None:
        raise credentials_exception
    return user

# 애플리케이션 생성
app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 환경에서는 특정 도메인만 허용하세요
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 초기 관리자 계정 생성
def create_admin_user(db: Session):
    admin = get_user(db, "A0001")
    if not admin:
        hashed_password = get_password_hash("admin1234")
        admin_user = User(
            user_id="A0001",
            password=hashed_password,
            name="관리자",
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print("관리자 계정이 생성되었습니다.")

# 서버 시작 시 관리자 계정 생성
@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    create_admin_user(db)
    db.close()

# 로그인 API
@app.post("/api/login", response_model=Token)
async def login_for_access_token(user_data: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_data.userId, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_id}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "name": user.name
    }

# 엑셀 파일 업로드 API
@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    type: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 관리자만 업로드 가능
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to upload files",
        )
    
    # 파일 저장
    file_location = f"uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    
    # 엑셀 파일 읽기
    try:
        df = pd.read_excel(file_location)
        
        if type == "students":
            process_student_data(df, db)
        elif type == "teachers":
            process_teacher_data(df, db)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid upload type",
            )
        
        return {"filename": file.filename, "status": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing file: {str(e)}",
        )
    finally:
        # 임시 파일 삭제
        if os.path.exists(file_location):
            os.remove(file_location)

def process_student_data(df: pd.DataFrame, db: Session):
    # 열 이름 확인 및 표준화
    columns = df.columns
    student_id_col = next((col for col in columns if '학번' in col), None)
    name_col = next((col for col in columns if '이름' in col), None)
    grade_col = next((col for col in columns if '학년' in col), None)
    class_col = next((col for col in columns if '반' in col), None)
    number_col = next((col for col in columns if '번호' in col), None)
    
    if not all([student_id_col, name_col, grade_col, class_col, number_col]):
        raise ValueError("필수 열이 누락되었습니다: 학번, 이름, 학년, 반, 번호")
    
    # 데이터 처리
    for _, row in df.iterrows():
        student_id = str(row[student_id_col])
        name = row[name_col]
        grade = str(row[grade_col])
        class_number = str(row[class_col])
        number = int(row[number_col])
        
        # 클래스 확인 또는 생성
        class_name = f"{grade}학년 {class_number}반"
        class_obj = db.query(Class).filter(Class.name == class_name).first()
        if not class_obj:
            class_obj = Class(
                name=class_name,
                grade=grade,
                class_number=class_number,
                total_students=0
            )
            db.add(class_obj)
            db.commit()
            db.refresh(class_obj)
        
        # 사용자 확인 또는 생성
        user = db.query(User).filter(User.user_id == student_id).first()
        if not user:
            # 기본 비밀번호는 학번과 동일하게 설정
            hashed_password = get_password_hash(student_id)
            user = User(
                user_id=student_id,
                password=hashed_password,
                name=name,
                role="student"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # 학생 정보 확인 또는 생성
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            student = Student(
                user_id=user.id,
                student_id=student_id,
                grade=grade,
                class_number=class_number,
                number=number
            )
            db.add(student)
            
            # 클래스 학생 수 증가
            class_obj.total_students += 1
            
            db.commit()
        else:
            # 학생 정보 업데이트
            student.grade = grade
            student.class_number = class_number
            student.number = number
            db.commit()

def process_teacher_data(df: pd.DataFrame, db: Session):
    # 열 이름 확인 및 표준화
    columns = df.columns
    name_col = next((col for col in columns if '이름' in col), None)
    grade_col = next((col for col in columns if '학년' in col), None)
    class_col = next((col for col in columns if '반' in col), None)
    
    if not all([name_col, grade_col, class_col]):
        raise ValueError("필수 열이 누락되었습니다: 이름, 담당 학년, 담당 반")
    
    # 데이터 처리
    for _, row in df.iterrows():
        name = row[name_col]
        grade = str(row[grade_col])
        class_number = str(row[class_col])
        
        # 교사 ID 생성 (T + 학년 + 반 + 000)
        teacher_id = f"T{grade}{class_number}000"
        
        # 클래스 확인 또는 생성
        class_name = f"{grade}학년 {class_number}반"
        class_obj = db.query(Class).filter(Class.name == class_name).first()
        if not class_obj:
            class_obj = Class(
                name=class_name,
                grade=grade,
                class_number=class_number,
                total_students=0
            )
            db.add(class_obj)
            db.commit()
            db.refresh(class_obj)
        
        # 사용자 확인 또는 생성
        user = db.query(User).filter(User.user_id == teacher_id).first()
        if not user:
            # 기본 비밀번호는 교사 ID와 동일하게 설정
            hashed_password = get_password_hash(teacher_id)
            user = User(
                user_id=teacher_id,
                password=hashed_password,
                name=name,
                role="teacher"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # 교사 정보 확인 또는 생성
        teacher = db.query(Teacher).filter(Teacher.teacher_id == teacher_id).first()
        if not teacher:
            teacher = Teacher(
                user_id=user.id,
                teacher_id=teacher_id,
                grade=grade,
                class_number=class_number
            )
            db.add(teacher)
            db.commit()
        else:
            # 교사 정보 업데이트
            teacher.grade = grade
            teacher.class_number = class_number
            db.commit()

# 서버 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

