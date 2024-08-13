import messageService from "../services/message.service.js";

const getChatView = async (req, res) => {
  try {
    const messages = await messageService.getAllMessages();
    res.render("chat", { messages });
  } catch (error) {
    console.error("Error al cargar la página de chat:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export default { getChatView };
