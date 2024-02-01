import express from 'express';
import bodyParser from 'body-parser';
import { getAllRules, getRuleById, createRule, updateRule, deleteRule } from './db.js';
import { verifyAuthNostr } from './auth.js';
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000'}));
app.use(async (req, res, next) => {
  const isAuthorized = await verifyAuthNostr(req, process.env.NPUB);
  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.get('/rules', async (req, res) => {
  const rules = await getAllRules();
  res.json(rules);
});
console.log(await getAllRules());

app.get('/rules/:id', async (req, res) => {
    const ruleId = parseInt(req.params.id);
    const rule = await getRuleById(ruleId);
    if (rule) {
      res.json(rule);
    } else {
      res.status(404).json({ error: 'Rule not found' });
    }
  });
  
  app.post('/rules', async (req, res) => {
    console.log("BODY: ", req.body);
    const newRule = req.body;
    const rule = await createRule(newRule);
    res.json(rule);
  });
  
  app.put('/rules/:id', async (req, res) => {
    const ruleId = parseInt(req.params.id);
    console.log("ruleId: ", ruleId);
    const updatedRule = req.body;
    const rule = await updateRule(ruleId, updatedRule);
    if (rule) {
      res.json(rule);
    } else {
      res.status(404).json({ error: 'Rule not found' });
    }
  });
  
  app.delete('/rules/:id', async (req, res) => {
    const ruleId = parseInt(req.params.id);
    const success = await deleteRule(ruleId);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Rule not found' });
    }
  });
  console.log(await getAllRules());
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });