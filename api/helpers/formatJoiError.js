export function formatJOIError (err) {
   return err.details[0].message.charAt(1).toUpperCase() + err.details[0].message.slice(2);
}