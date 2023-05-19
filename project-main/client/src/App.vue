<template>
  <div id="chatContainer">
    <div class="chatHeader">
      <h4>University Assistant</h4>
    </div>
    <div class="chatBody">
      <div class="messages" v-for="message in messages" :key="message.id">
        <div class="messageRow user" v-if="message.sender == 'user'">
          <div class="message user">
            <p>{{ message.message }}</p>
          </div>
        </div>
        <div class="messageRow bot" v-else>
          <div class="message bot">
            <div class="messageImage" v-if="message.messagetype == 'image'">
              <img :src="message.message" alt="Bot Image">
            </div>
            <div class="messageText" v-else>
              <p>{{ message.message }}</p>
            </div>
        </div>
        </div>
      </div>
    </div>
    <div class="chatFooter">
      <form @submit.prevent="sendMessage()">
        <input v-model="messageContent" id="createMessage" />
        <input type="Submit" />
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
const emptymsg = {
  messageType: 'text',
  text: '',
};
console.log("Refreshed")
axios
  .post("http://localhost:8000/chat", emptymsg)
  .then((res) => console.log(res.data));
export default {
  name: "App",
  setup() {
    const messages = ref([]),
      messageContent = ref("");
    //Sends the message on form submit
    function sendMessage() {
      if (messageContent.value == "") return;
      createMessage(messageContent.value, 'user');
      getResponse(messageContent.value);
      messageContent.value = "";
    }
    // ID bit needs updating so multiple messages from one party is same colour
    function createMessage(message, sender) {
      let id = 0;
      if (messages.value[messages.value.length - 1]) {
        id = messages.value[messages.value.length - 1].id + 1;
      }
      if (sender == 'user') {
        //console.log("txtmsgfromuserbeingaddedtoscreen");
        messages.value.push({
          id: id,
          sender: sender,
          messagetype: 'text',
          message: message,
        });
      } else { 
      if (sender == 'bot')  
        if (message.response_type == 'text') {
          console.log("TXTmsgfrombotiscreating")
          messages.value.push({
            id: id,
            sender: sender,
            messagetype: 'text',
            message: message.text,
          })
        }
        if (message.response_type == 'image') {
          messages.value.push({
            id: id,
            sender: sender,
            messagetype: 'image',
            message: message.source,
          })
        }
      }
    }
    async function getResponse(message) {
      const postData = {
        messageType: 'text',
        text: message,
      };
      const { data } = await axios.post("http://localhost:8000/chat", postData);
      const { response } = data;
      console.log(response);

      response.forEach( res => {
        console.log(res);
        //createMessage(res)
        if (res.response_type === 'text') {
          createMessage(res, 'bot');
          console.log("attemptedcreatebotTXTmsg");
        }
        if (res.response_type === 'image') {
          createMessage(res, 'bot');
          console.log("attemptedcreatebotIMGmsg");
        }
      });
      //createMessage(response);
    }
    return { messages, messageContent, sendMessage };
  },
};
</script>

<style>
#chatContainer {
  background-color: #ffffff;
  height: 1920px;
  width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}
.chatHeader {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  color: rgb(27, 99, 182);
  margin-left: 5%;
}
.chatFooter {
  position: absolute;
  bottom: 0px;
  width: 100%;
}
.chatFooter form {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%;
  margin: 0 auto;
}
.chatBody {
  overflow-y: scroll;
  height: 83%;
}
#createMessage {
  width: 80%;
}
input:not(#createMessage) {
  background-color: rgb(235, 12, 12);
  border: 0;
  color: white;
  padding: 10px;
  margin-bottom: 12px;
  opacity: 0.8;
}
input:not(#createMessage):hover {
  opacity: 0.5;
}
.messageRow {
  display: flex;
  justify-content: flex-end;
}
.messageRow.bot {
  justify-content: flex-start;
}
.message p {
  color: white;
  padding: 0px 15px 0px 15px;
}
.message {
  border-radius: 50px;
  text-align: center;
  margin: 10px;
}
.messageRow.user .message {
  background-color: #585f66;
}
.messageRow.bot .message {
  background-color: #43b1cc;
}
.chatBody::-webkit-scrollbar {
  width: 0px;
  height: 100%;
}
</style>
