def test_read_main(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


def test_user_creation(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    assert response.json() == {"id": 1, "username": "testuser"}

def test_login_returns_access_token(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_with_wrong_credentials(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    response = client.post("/auth/login", data={"username": "testuser", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect username or password"}


def test_user_creation_duplicate_check(client):
    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201
    assert response.json() == {"id": 1, "username": "testuser"}

    response = client.post("/users/", json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Username already registered"}
