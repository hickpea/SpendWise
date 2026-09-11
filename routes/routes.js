import express from 'express'
import { home, dashboardApi, addTransaction, addGoal, addBill, deleteItem } from '../controllers/controllers.js'
const router=express.Router()

router.get('/',home)
router.get('/api/dashboard', dashboardApi)
router.post('/api/transactions', addTransaction)
router.post('/api/goals', addGoal)
router.post('/api/bills', addBill)
router.delete('/api/:collection/:id', deleteItem)

export {router}