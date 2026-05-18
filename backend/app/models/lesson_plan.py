from typing import Optional
from datetime import date, datetime
from sqlalchemy import String, Text, Date, DateTime
from sqlalchemy.orm import Mapped, mapped_column, MappedAsDataclass
from sqlalchemy.sql import func
from app import db

class LessonPlan(MappedAsDataclass, db.Model):
    __tablename__ = 'lesson_plans'
    
    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    objective: Mapped[str] = mapped_column(Text, nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    scheduled_date: Mapped[date] = mapped_column(Date, nullable=False)
    subject: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    support_materials: Mapped[Optional[str]] = mapped_column(Text, nullable=True, default=None)
    tags: Mapped[Optional[str]] = mapped_column(String(200), nullable=True, default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), init=False)

