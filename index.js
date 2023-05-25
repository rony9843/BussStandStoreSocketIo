const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    // origin: [
    //   "https://rony9843.github.io/Queenz-Zone-dashboard/",
    //   "https://rony9843.github.io/",
    //   "https://rony9843.github.io",
    //   "https://queenzzone.online/",
    // ],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
const port = process.env.PORT || 5500;

app.get("/", (req, res) => {
  res.send("this is masum kaka socket io server");
});

let all_users = [];

let orderItemList = [];

// ? lets start
io.on("connection", (socket) => {
  // received user info
  socket.on("userInfo", (userInfo) => {
    console.log("userInfo -> ", userInfo);

    all_users = [...all_users, { id: socket.id, info: userInfo }];

    io.emit("activeUserInfo", all_users);

    console.log("all users -> ", all_users);
  });

  socket.on("newUser", (data) => {
    io.emit("messageResponse", data);

    console.log("this is message -> ", data);
  });

  socket.on("QrCodeState", (data) => {
    io.emit("QrCodeStateResponse", !data);
    io.emit("QrCodeStateResponseReader", !data);

    console.log("QrCodeState -> ", !data);
  });

  socket.on("orderItems", (data) => {
    orderItemList = [...orderItemList, { data }];

    io.emit("orderItemList", orderItemList);

    console.log("items -> ", orderItemList);
  });

  // disconnect
  socket.on("disconnect", () => {
    all_users = all_users.filter((users) => users.id !== socket.id);
    io.emit("activeUserInfo", all_users);
    console.log("all users -> ", all_users);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
