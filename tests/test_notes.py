def test_create_note_with_auth(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.", "summary": "This is a summary"}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 1
    assert data["title"] == "Test Note"
    assert data["content"] == "This is a test note."
    assert data["created_by"] == 1
    assert data["created_at"] is not None
    assert data["summary"] == "This is a summary"



def test_create_note_with_not_auth(client):
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.","summary": "This is a summary"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

def test_read_note_by_id(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.", "summary": "This is a summary"}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    response = client.get("/notes/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["title"] == "Test Note"
    assert data["content"] == "This is a test note."
    assert data["created_by"] == 1
    assert data["created_at"] is not None
    assert data["summary"] == "This is a summary"



def test_create_note_with_auth_get_note(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.", "summary": "This is a summary"}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    response = client.get("/notes/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    print(data)
    assert len(data) == 1
    assert data[0]["id"] == 1
    assert data[0]["title"] == "Test Note"
    assert data[0]["content"] == "This is a test note."
    assert data[0]["created_by"] == 1
    assert data[0]["created_at"] is not None
    assert data[0]["summary"] == "This is a summary"




def test_create_note_with_auth_empty_title(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "", "content": "This is a test note.", "summary": "This is a summary"}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 422
    assert response.json()["detail"][0]["msg"] == "String should have at least 1 character"
