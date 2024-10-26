<?php 

namespace App\Repositories;

use App\Models\Feedback;

class FeedbackRepository
{
    public $feedback;

    public function __construct(Feedback $feedback)
    {
        $this->feedback = $feedback;
    }

    public function getAll()
    {
        return $this->feedback->all();
    }

    public function create(array $data)
    {
        return $this->feedback->create($data);
    }

    public function find($id)
    {
        return $this->feedback->find($id);
    }

    public function delete($id)
    {
        $feedback = $this->find($id);

        return $feedback->delete();
    }
}