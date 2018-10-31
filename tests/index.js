/**
 * Created by elf
 */

const cli = require('cli');
const Amocrm = require('../index');

const params = cli.parse({
  host: ['h', 'host', 'string', ''], // -f, --file FILE   A file to process
  login: ['l', 'login', 'string', ''], // -t, --time TIME   An access time
  hash: ['p', 'hash', 'string', ''], //     --work STRING What kind of work to do
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async () => {
  const a = new Amocrm(params.host, params.login, params.hash, true);
  await a.auth();

  const info = await a.getCurrentAccount();
  console.log(info);
  console.dir(info.custom_fields.contacts);

  // console.dir(await a.getContacts({ query: '123', limit_rows: 1 }));

  const contact = await a.createContact({ name: 'TEST' });
  console.dir(contact);

  const lead = await a.createLead({ name: 'TEST LEAD', contacts_id: contact.id });
  console.log(lead);

  const task = await a.createTask({
    element_type: 2,
    element_id: lead.id,
    text: 'TEST',
    complete_till_at: '23:59',
  });
  console.dir(task);

  await sleep(3000);

  console.dir(
    await a.updateLead({
      id: lead.id,
      updated_at: Math.round(Date.now() / 1000),
      name: 'TEST LEAD UPDATED',
    }),
  );

  console.dir(
    await a.updateContact({
      id: contact.id,
      updated_at: Math.round(Date.now() / 1000),
      name: 'TEST CONTACT UPDATED',
    }),
  );
})();
