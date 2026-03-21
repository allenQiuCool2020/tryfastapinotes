def test_read_main(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


def test_user_creation(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json() =={"id": 1, "username": "testuser"}


def test_login_returns_access_token(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_with_wrong_credentials(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    response = client.post("/auth/login", data={"username": "testuser", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect username or password"}


def test_create_note_with_auth(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    print(response.json())
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.", }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["title"] == "Test Note"
    assert data["content"] == "This is a test note."
    assert data["created_by"] == 1
    assert data["created_at"] is not None

def test_create_note_with_not_auth(client):
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.", })
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_update_note_with_auth(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    print(response.json())
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.", }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    response = client.patch("/notes/1", json={"title": "Test Note2", "content": "This is a test note.", }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Note2"


def test_update_note_with_not_auth(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.", }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    response = client.patch("/notes/1", json={"title": "Test Note2", "content": "This is a test note.", })
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_delete_note_with_auth(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.", }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    response = client.delete("/notes/1", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {"detail": "Note deleted successfully"}


def test_delete_note_with_not_auth(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.", }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    response = client.delete("/notes/1")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_non_owner_cannot_update_note(client):
    # Create first user and note
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.", }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    # Create second user and log in with it
    response = client.post("/users/", json={"username": "testuser2", "password": "testpassword"})
    assert response.status_code == 200
    response = client.post("/auth/login", data={"username": "testuser2", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token2 = response.json()["access_token"]

    # Try to update the note which was created by the first user with the second user
    response = client.patch("/notes/1", json={"title": "Test Note", "content": "This is a test note."}, headers={"Authorization": f"Bearer {token2}"})
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authorized to update this note"}


def test_non_owner_cannot_delete_note(client):
    # Create first user and note
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.", }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    # Create second user and log in with it
    response = client.post("/users/", json={"username": "testuser2", "password": "testpassword"})
    assert response.status_code == 200
    response = client.post("/auth/login", data={"username": "testuser2", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token2 = response.json()["access_token"]

    # Try to delete the note which was created by the first user with the second user
    response = client.delete("/notes/1", headers={"Authorization": f"Bearer {token2}"})
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authorized to delete this note"}
    