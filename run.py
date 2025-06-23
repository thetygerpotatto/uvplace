# run.py
from flaskr import createApp  # import from your package
create_app = createApp.create_app
socket = createApp.socketio

app = createApp.create_app()

if __name__ == '__main__':
    socket.run(app,host="0.0.0.0", port=80, debug=True)
