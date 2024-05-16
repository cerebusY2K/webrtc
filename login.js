function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulate login validation
    if (username === "user" && password === "pass") {
        // Redirect to the video call page on successful login
        window.location.href = 'video.html';
    } else {
        alert('Invalid username or password!');
    }
}
