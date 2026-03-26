from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

router = APIRouter(prefix="/notes", tags=["notes"])


@router.post("/", response_model=schemas.NoteRead, status_code=status.HTTP_201_CREATED)
def create_note(
    note: schemas.NoteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_note(db=db, note=note, user_id=current_user.id)

@router.get("/", response_model=list[schemas.NoteRead])
def read_notes(db: Session = Depends(get_db)):
    notes = crud.get_notes(db=db)
    return notes
    

@router.get("/{note_id}", response_model=schemas.NoteRead)
def read_note(note_id: int, db: Session = Depends(get_db)):
    db_note = crud.get_note(db=db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note


@router.patch("/{note_id}", response_model=schemas.NoteRead)
def update_note(
    note_id: int,
    note_update: schemas.NoteUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_note = crud.get_note(db=db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    if db_note.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this note")
    return crud.update_note(db=db, note_id=note_id, note_update=note_update)


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_note = crud.get_note(db=db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    if db_note.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this note")
    crud.delete_note(db=db, note_id=note_id)
    return {"detail": "Note deleted successfully"}