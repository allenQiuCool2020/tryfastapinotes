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


def test_list_notes_returns_created_note(client):
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


def test_create_note_with_weather_filtering(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    response = client.post("/notes/", json={"title": "Test Note", "content": "This is a test note.", "summary": "This is a summary", "weather": "sunny"}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    # response = client.get('"/notes/?weather="sunny"')
    response = client.get("/notes/", params={"weather": "sunny"})
    assert response.status_code == 200


def test_create_note_with_pagination(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    for i in range(6):
        response = client.post(
            "/notes/",
            json={"title": f"Note {i}", "content": f"Content {i}"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 201
    response = client.get("/notes/")
    assert response.status_code == 200
    data = response.json()
    print(data)
    assert isinstance(data, list)
    assert len(data) == 5


def test_create_note_with_pagination_plus_weather_filter(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"
    token = response.json()["access_token"]
    for i in range(7):
        response = client.post(
            "/notes/",
            json={"title": f"Note {i}", "content": f"Content {i}", "weather": "sunny"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 201
    response = client.get("/notes/", params={"weather": "sunny"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 5
