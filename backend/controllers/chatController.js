const prisma = require("../models/prismaClient");

const clientsConnected = new Map();

exports.getAllConversations = async (req, res) => {
  const conversations = await prisma.conversation.findMany({
    include: {
      users: true,
    },
    where: {
      users: {
        some: {
          id: req.user.id,
        },
      },
    },
  });

  return res.json({
    conversations: conversations.map((value) => {
      if (value.type === "PRIVATE") {
        value.title = value.users.find((user) => user.id !== req.user.id).name;
      }

      return value;
    }),
  });
};

// TODO validation, file size check
exports.saveAttachment = async (req, res) => {
  const attachment = await prisma.attachment.create({
    omit: {
      message_id: true,
      path: true,
    },
    data: {
      filename: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
    },
  });
  res.json({ attachment: attachment });
};

// TODO validation
exports.downloadAttachment = async (req, res) => {
  const attachment_id = req.params.id;

  const attachment = await prisma.attachment.findUnique({
    where: {
      id: attachment_id,
    },
  });

  res.download(attachment.path, attachment.filename);
};

exports.connect = (ws, req) => {
  clientsConnected.set(req.user.id, ws);

  ws.on("close", () => {
    clientsConnected.delete(req.user.id);
  });

  ws.on("message", async (msg) => {
    msg = JSON.parse(msg);

    switch (msg.type) {
      case "RETRIEVE":
        const messages = await prisma.message.findMany({
          include: {
            sender: true,
            attachment: true,
          },
          omit: {
            sender_id: true,
            conversation_id: true,
          },
          where: {
            conversation_id: msg.content,
          },
        });
        ws.send(JSON.stringify({ type: "RETRIEVE", content: messages }));
        break;
      case "MESSAGE":
        // TODO check if user is in that conversation
        // FIXME cache the conversation
        const conversationMembers = await prisma.user.findMany({
          where: {
            conversations: {
              some: {
                id: msg.conversation_id,
              },
            },
          },
        });

        const message = await prisma.message.create({
          include: {
            sender: true,
            attachment: true,
          },
          omit: {
            sender_id: true,
            conversation_id: true,
          },
          data: {
            sender: {
              connect: {
                id: req.user.id,
              },
            },
            conversation: {
              connect: {
                id: msg.conversation_id,
              },
            },
            attachment: msg.attachment_id
              ? {
                  connect: {
                    id: msg.attachment_id,
                  },
                }
              : null,
            content: msg.content,
            type: "USER",
          },
        });

        conversationMembers.forEach((member) => {
          const client = clientsConnected.get(member.id);
          if (client) {
            client.send(JSON.stringify(message));
          }
        });

        break;
    }
  });
};
