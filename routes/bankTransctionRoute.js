import express from "express";
import {
  bankToBankTransferController,
  getBankToBankTransfers,
  deleteBankToBankTransfer,
  updateBankToBankTransfer,
  getAllDeposits,
  getAllWithdrawals,
  deleteDeposit,
  deleteWithdrawal,
  updateDeposit,
  updateWithdrawal,
  CashDepositeIntoBankController,
  CashWithdrawfromBankController,
  getBankToBankTransferById,
  getCashDepositIntoBankById,
  getCashWithdrawFromBankById,
} from "../controllers/bankTransactionController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/banktoBankTransfer", requireSignIn, bankToBankTransferController);
router.get("/transfers", getBankToBankTransfers);
router.delete("/transfers/:id", deleteBankToBankTransfer);
router.put("/transfers/:id", updateBankToBankTransfer);

router.post(
  "/CashDepositeIntoBank",
  requireSignIn,
  CashDepositeIntoBankController
);
router.post(
  "/CashWithdrawfromBank",
  requireSignIn,
  CashWithdrawfromBankController
);


router.get("/deposits", getAllDeposits);
router.get("/withdrawals", getAllWithdrawals);

// Delete
router.delete("/deposit/:id", deleteDeposit);
router.delete("/withdrawal/:id", deleteWithdrawal);

// Update
router.put("/deposit/:id", updateDeposit);
router.put("/withdrawal/:id", updateWithdrawal);



router.get(
  "/getbanktoBankTransfer/:_id",
  requireSignIn,
  getBankToBankTransferById
);
router.get(
  "/getCashDepositeIntoBank/:_id",
  requireSignIn,
  getCashDepositIntoBankById
);
router.get(
  "/getCashWithdrawfromBank/:_id",
  requireSignIn,
  getCashWithdrawFromBankById
);

export default router;
