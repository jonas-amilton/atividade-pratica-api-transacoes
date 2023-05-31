import { Request, Response } from "express";
import { User } from "../models/user";
import { usersDb } from "../database/users";
import { ApiResponse } from "../util/http-response.adapter";
import { Transactions, TypeTransaction } from "../models/transactions";
import { transactionsDb } from "../database/transactions";

export class TransactionsController {
  public create(req: Request, res: Response) {
    try {
      const { title, value, type } = req.body;
      const { userid } = req.params;

      const userFind = usersDb.find((user) => user.id === userid);
      if (!userFind) {
        return ApiResponse.notFound(res, "User");
      }

      const transaction = new Transactions(title, value, type);
      userFind.transactions.push(transaction);

      return ApiResponse.success(res, "user encontrado", userFind);
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }

  public get(req: Request, res: Response) {
    try {
      const { userid, transactionid } = req.params;

      const finduserid = usersDb.find((user) => user.id === userid);

      if (!finduserid) {
        return ApiResponse.notFound(res, "User");
      }

      const findtransactionuserid = finduserid.transactions.find(
        (transaction) => transaction.id === transactionid
      );

      if (!findtransactionuserid) {
        return ApiResponse.notFound(res, "transaction");
      }

      return ApiResponse.success(
        res,
        "transaction realizada",
        findtransactionuserid.toJsonT()
      );
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }

  public list(req: Request, res: Response) {
    try {
      const { userid } = req.params;
      const { type, title } = req.query;

      const existeIduser = usersDb.find((user) => user.id === userid);
      if (!existeIduser?.transactions) {
        return ApiResponse.notFound(
          res,
          `Transação do usuario ${existeIduser?.name} não encontrado!`
        );
      }
      const transactions = existeIduser.transactions;

      const existeType = existeIduser.transactions.filter(
        (t) => t.type === type
      );

      if (type) {
        return ApiResponse.success(
          res,
          "Transação filtrada por tipo",
          existeType
        );
      }

      const existeTitle = existeIduser.transactions.filter(
        (t) => t.type === type
      );

      if (title) {
        return ApiResponse.success(
          res,
          "Transação filtrada por titulo",
          existeTitle
        );
      }

      let debito = transactions
        .filter((t) => t.type === TypeTransaction.Debit)
        .reduce((soma, transaction) => soma + transaction.value, 0);

      let credito = transactions
        .filter((t) => t.type === TypeTransaction.Credit)
        .reduce((soma, transaction) => soma + transaction.value, 0);

      return ApiResponse.success(res, "Transações listadas com sucesso", {
        transactions,
        balance: { credito, debito, total: credito - debito },
      });
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }

  public delete(req: Request, res: Response) {
    try {
      const { userid, transactionid } = req.params;

      const finduserid = usersDb.find((user) => user.id === userid);

      if (!finduserid) {
        return ApiResponse.notFound(res, "User");
      }

      const existIdTransaction = finduserid.transactions.findIndex(
        (i) => i.id === transactionid
      );

      if (existIdTransaction < 0) {
        return ApiResponse.notFound(res, "Transaction");
      }

      const deleteTransaction = finduserid.transactions.splice(
        existIdTransaction,
        1
      );

      return ApiResponse.success(
        res,
        "Transação deletada com sucesso",
        deleteTransaction[0].toJsonT()
      );
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }

  public update(req: Request, res: Response) {
    try {
      const { userid, transactionid } = req.params;
      const { title, value, type } = req.body;

      const finduserid = usersDb.find((user) => user.id === userid);

      if (!finduserid) {
        return ApiResponse.notFound(res, "User");
      }

      const existIdTransaction = finduserid.transactions.find(
        (i) => i.id === transactionid
      );

      if (!existIdTransaction) {
        return ApiResponse.notFound(res, "Transaction");
      }

      if (title) {
        existIdTransaction.title = title;
      }

      if (type) {
        existIdTransaction.type = type;
      }

      if (value) {
        existIdTransaction.value = value;
      }

      return ApiResponse.success(
        res,
        "Transação atualizada com sucesso",
        existIdTransaction.toJsonT()
      );
    } catch (error: any) {
      return ApiResponse.serverError(res, error);
    }
  }
}
