//const prompt = require('prompt-sync')();
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const cors = require('cors');
const express = require('express');
const app = express();


// Create Assistant service object.
const assistant = new AssistantV2({
  version: '2023-03-31',
  authenticator: new IamAuthenticator({
    // Currently using draft key not live key
    apikey: '9GkaQvSlWEVcCGPYiVsh6YEn4RYPbxrvuZqqBfpoEpUz', // replace with API key
  }),
  url: 'https://api.eu-gb.assistant.watson.cloud.ibm.com', // replace with URL
});

const assistantId = '94bdc4cd-b1f1-40cf-a9c3-48808be05cb0'; // environment ID

// Start conversation with empty message
blankMsg = {
  messageType: 'text',
  text: '',
};
//console.log(messageInput);
context = {};
let replyresult = {
    output: {
        generic: blankMsg
    }
};
let fullResponse = ['testmsg'];
let fullerResponse = {
  postData: fullResponse,
  context: context,
};

/*sendMessage(messageInput);

// Send message to assistant.
function sendMessage(messageInput, context) {
  assistant
    .messageStateless({
      assistantId,
      input: messageInput,
      context: context,
    })
    .then(res => {
      processResult(res.result);
    })
    .catch(err => {
      console.log(err); // something went wrong
    });
}

// Process the result.
function processResult(result) {

  let context = result.context;

  // Print responses from actions, if any. Supports only text responses.
  if (result.output.generic) {
    if (result.output.generic.length > 0) {
      result.output.generic.forEach( response => {
        if (response.response_type === 'text') {
          console.log(response.text);
        }  
      });
    }
  }

  // Prompt for the next round of input unless skip_user_input is true.
  let newMessageFromUser = '';
  if (result.context.global.system.skip_user_input !== true) {
    newMessageFromUser = prompt('>> ');
  }

  if (newMessageFromUser !== 'quit') {
    newMessageInput = {
      messageType: 'text',
      text: newMessageFromUser,
    }
    sendMessage(newMessageInput, context);
  }
}*/

app.use(cors());
app.use(express.urlencoded({  extended: true  }));
app.use(express.json());

app.post('/chat', async(req,res) => {
  const {message} = req.body;
  console.log("New input:");
  console.log(req.body.postData);
  //console.log(req.body.messageType)
  //console.log(message);
  await assistant
    .messageStateless({
        assistantId,
        input: req.body.postData,
        context: req.body.postData.context,
    })
    .then(reply => {
        console.log("Recieved by watson")
        //processResult(reply.result);
        replyresult = reply.result
        //console.log
        context = reply.result.context;
    })
    .catch(err => {
        console.log(err); // something went wrong
    });
    // Print responses from actions, if any. Supports only text responses.
    fullResponse = []
    if (replyresult.output.generic) {
        //console.log(replyresult.output.generic);
        if (replyresult.output.generic.length > 0) {
            //Probably going to combine the below if statements but it helps with debugging atm
            replyresult.output.generic.forEach( response => {
                if (response.response_type === 'text') {
                    console.log("Text reply from watson:")
                    console.log(response.text);
                    fullResponse.push(response);
                } 
                if (response.response_type === 'image')  {
                    console.log("Image reply from watson:")
                    console.log(response.source);
                    fullResponse.push(response);
                }
            });
        }
    }
    fullerResponse = {
      postData: fullResponse,
      context: context,
    };

    
  //const response = await processResult(message);
  res.json({
    response: fullerResponse,
  })
});
app.listen(8000, (req, res) => {
  console.log('running');
});
