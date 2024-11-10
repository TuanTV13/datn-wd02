<?php

namespace App\Repositories;

use App\Models\Transaction;

class TransactionRepository
{
    protected $transaction;

    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
    }

    public function findByTxnRef($txnRef)
    {
        return Transaction::where('txn_ref', $txnRef)->first();
    }

    public function getAllTransactions()
    {
        return $this->transaction->with(['user', 'ticket', 'event'])->get();
    }

    public function createTransaction(array $data)
    {
        return $this->transaction->create($data);
    }

    public function findTransactionById($id)
    {
        return $this->transaction->with(['user', 'ticket', 'event'])->find($id);
    }

    public function findByTicketCode($ticketCode, $eventId)
    {
        return $this->transaction->with([
            'user',
            'ticket',
            'event'
        ])->where('ticket_code', $ticketCode)
            ->whereHas('event', function ($query) use ($eventId) {
                $query->where('id', $eventId);
            })->first();
    }

    public function getUserTransactions($userId)
    {
        return $this->transaction->where('user_id', $userId)->get();
    }

    public function updateTransactionStatus($id, $status)
    {
        $transaction = $this->findTransactionById($id);
        if ($transaction) {
            $transaction->status = $status;
            $transaction->save();
            return $transaction;
        }
        return null;
    }

    public function deleteTransaction($id)
    {
        $transaction = $this->findTransactionById($id);
        if ($transaction) {
            $transaction->delete();
            return true;
        }
        return false;
    }
}
