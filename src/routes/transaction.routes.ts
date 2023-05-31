import { Router } from "express";
import { TransactionsController } from "../controllers/transactions.controller";
import { transactionCheck } from "../middlewares/transaction.middleware";

export const transactionsRoutes = () => {
  const app = Router({
    mergeParams: true,
  });

  app.post("/", [transactionCheck], new TransactionsController().create);
  app.get("/:transactionid", new TransactionsController().get);
  app.get("/", new TransactionsController().list);
  app.delete("/:transactionid", new TransactionsController().delete);
  app.put("/:transactionid", new TransactionsController().update);

  return app;
};
