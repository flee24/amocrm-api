/**
 * Created by elf
 */

const cli = require('cli');
const Amocrm = require('../index');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

test('ENV vars HOST, LOGIN, HASH', () => {
  expect(process.env.HOST).toBeDefined();
  expect(process.env.LOGIN).toBeDefined();
  expect(process.env.HASH).toBeDefined();
});

it('Auth', async () => {
  expect.hasAssertions();
  const a = new Amocrm(process.env.HOST, process.env.LOGIN, process.env.HASH, true);
  await a.auth();
});

/*
(async () => {
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
*/
