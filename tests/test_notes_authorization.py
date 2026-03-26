def test_update_note_with_auth(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note."}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    response = client.patch("/notes/1", json={"title": "Test Note2", "content": "This is a test note."}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Note2"


def test_update_note_with_not_auth(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note."}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    response = client.patch("/notes/1", json={"title": "Test Note2", "content": "This is a test note."})
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_delete_note_with_auth(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note."}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    response = client.delete("/notes/1", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {"detail": "Note deleted successfully"}


def test_delete_note_with_not_auth(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note."}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    response = client.delete("/notes/1")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


def test_non_owner_cannot_update_note(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note."}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201

    response = client.post("/users/", json={"username": "testuser2", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser2", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token2 = response.json()["access_token"]

    response = client.patch("/notes/1", json={"title": "Test Note", "content": "This is a test note."}, headers={"Authorization": f"Bearer {token2}"})
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authorized to update this note"}


def test_non_owner_cannot_delete_note(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note."}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201

    response = client.post("/users/", json={"username": "testuser2", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser2", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token2 = response.json()["access_token"]

    response = client.delete("/notes/1", headers={"Authorization": f"Bearer {token2}"})
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authorized to delete this note"}
