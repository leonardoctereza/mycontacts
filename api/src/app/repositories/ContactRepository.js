const db = require('../../database');

class ContactsRepository {
  async findAll(orderBy) {
    const direction = orderBy?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const contacts = await db.query(`
    SELECT co.*, ca.name as category_name 
    FROM contacts co
    LEFT JOIN categories ca ON ca.id = co.category_id
    ORDER BY co.name ${direction}
    `);
    return contacts;
  }

  async findById(id) {
    const [contact] = await db.query(
      `
      SELECT co.*, ca.name as category_name 
      FROM contacts co
      LEFT JOIN categories ca ON ca.id = co.category_id
      WHERE co.id = $1`,
      [id],
    );
    return contact;
  }

  async findByEmail(email) {
    const [contact] = await db.query('SELECT * FROM contacts WHERE email = $1', [email]);
    return contact;
  }

  async delete(id) {
    await db.query('DELETE FROM contacts WHERE id = $1', [id]);
  }

  async create({
    name, email, phone, category_id,
  }) {
    const [contact] = await db.query(`
    INSERT INTO contacts(name, email, phone, category_id) 
    VALUES($1,$2,$3,$4)
    RETURNING *
    `, [name, email, phone, category_id]);
    return contact;
  }

  async update(id, {
    name, email, phone, category_id,
  }) {
    const [contact] = await db.query(`
    UPDATE contacts 
    SET name = $1,
    email = $2,
    phone = $3,
    category_id = $4
    WHERE id = $5
    RETURNING *`, [name, email, phone, category_id, id]);
    return contact;
  }
}

module.exports = new ContactsRepository();
