const db = require('../../database');

class CategoryRepository {
  async findAll() {
    const category = await db.query('SELECT * FROM categories ORDER BY name');
    return category;
  }

  async findById(id) {
    const [category] = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    return category;
  }

  async findByName(name) {
    const [category] = await db.query('SELECT * FROM categories WHERE name = $1', [name]);
    return category;
  }

  async delete(id) {
    await db.query('DELETE FROM categories WHERE id = $1', [id]);
  }

  async create({ name }) {
    const [category] = await db.query(`
    INSERT INTO categories (name) 
    VALUES($1)
    RETURNING *
    `, [name]);
    return category;
  }

  async update(id, { name }) {
    const [contact] = await db.query(`
    UPDATE Category 
    SET name = $1,
    WHERE id = $2
    RETURNING *`, [name, id]);
    return contact;
  }
}

module.exports = new CategoryRepository();
