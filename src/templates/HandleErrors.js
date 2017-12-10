import PubSub from 'pubsub-js';

class HandleErrors {
    publishError(jsonResponse){
        console.log(jsonResponse);
         for(var i = 0; i < jsonResponse.errors.length; i++){
             PubSub.publish("validation-error",jsonResponse.errors[i]);
         }
    }
}

export default HandleErrors;