<?php

namespace App\Repositories;

use App\Models\Voucher;

class VoucherRepository
{
    protected $voucher;

    public function __construct(Voucher $voucher)
    {
        $this->voucher = $voucher;
    }

    public function getAll()
    {
        return $this->voucher->get();
    }

    public function findById($id)
    {
        return $this->voucher->find($id);
    }

    public function create(array $data)
    {
        return $this->voucher->create($data);
    }

    public function update($id, array $data)
    {
        $voucher = $this->findById($id);
        $voucher->update($data);
        return $voucher;
    }

    public function delete($id)
    {
        $voucher = $this->findById($id);
        return $voucher->delete();
    }
}