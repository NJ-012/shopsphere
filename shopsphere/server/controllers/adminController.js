import { adminGetAllUsers, adminGetAllVendors, adminGetAllOrders } from '../db/queries.js';

export async function getUsers(req, res) {
  try {
    const users = await adminGetAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function getVendors(req, res) {
  try {
    const vendors = await adminGetAllVendors();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
}

export async function getOrders(req, res) {
  try {
    const orders = await adminGetAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
