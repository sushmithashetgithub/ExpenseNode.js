const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/add', expenseController.addExpense);
router.get('/all', expenseController.getExpenses);
router.delete('/delete/:id', expenseController.deleteExpense);

module.exports = router;
