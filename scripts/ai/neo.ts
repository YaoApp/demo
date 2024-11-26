import { io, neo } from "@yao/runtime";

/**
 * Neo Prepare hook
 */
function Prepare(ctx: neo.Context, messages: neo.Message[]): neo.Message[] {
  // Print the namespace and field to the terminal for debugging
  console.log(ctx.namespace);
  console.log(ctx.field);
  console.log(ctx.formdata);

  //  the namespace is "Table-Page-pets/Form-Modal-pets" and the field is "description", Field is the current field that the user is interacting with.
  if (ctx.namespace === "Table-Page-pets/Form-Modal-pets") {
    switch (ctx.field?.bind) {
      case "description":
        const lastMessage = messages[messages.length - 1];
        const prompts: neo.Message[] = [
          {
            role: "system",
            content: `FORMDATA: ${JSON.stringify(ctx.formdata || {})}`,
          },
          {
            role: "system",
            content: `
              - According to the formdata I provided, generate a description for the pet.
              - The description should be a short paragraph that describes the pet.
              - Answer me the description only, do not include any other information.
            `,
          },
          lastMessage,
        ];

        // For debugging, print the prompts to the terminal
        console.log("--- Prompts Content---");
        console.log(prompts);
        return prompts;
    }
  }

  // The default behavior is to return the messages as-is
  return messages;
}

/**
 * Neo Write hook
 */
function Write(
  ctx: neo.Context,
  messages: neo.Message[],
  response: neo.Response,
  content?: string,
  writer?: io.ResponseWriter
): neo.Response[] {
  // Print the namespace and field to the terminal for debugging
  console.log(ctx.namespace);
  console.log(ctx.field);
  console.log(ctx.formdata);

  //  the namespace is "Table-Page-pets/Form-Modal-pets" and the field is "description", Field is the current field that the user is interacting with.
  if (ctx.namespace === "Table-Page-pets/Form-Modal-pets") {
    const { namespace, field } = ctx;
    if (content === undefined) {
      return [response];
    }

    if (!response.done) {
      return [response];
    }

    response.actions = [
      {
        name: "Done",
        type: "Common.emitEvent",
        payload: { key: `${namespace}/${field.bind}/unloading` },
      }, // mark the field as done
      {
        name: "SetFieldsValue",
        type: "Common.emitEvent",
        payload: {
          key: `${namespace}/setFieldsValue`,
          value: { description: content },
        },
      }, // Update the formdata with the description field
      {
        name: "SetNeoVisible",
        type: "Common.emitEvent",
        payload: {
          key: `app/setNeoVisible`,
          value: { visible: true },
        },
      }, // show the chatbot, for editing the output
    ];

    console.log("--- Response Actions ---");
    console.log(response.actions);
    console.log("--- Response ---");
  }

  // the default behavior is to return the response as-is
  return [response];
}
