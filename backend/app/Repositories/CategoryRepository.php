<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository
{

    protected $category;

    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    public function getAll()
    {
        return $this->category->where('id', '!=', 8)->get();;
    }

    public function create(array $data)
    {
        return $this->category->create($data);
    }

    public function find($id)
    {
        return $this->category->with('events')->find($id);
    }

    public function update($id, array $data)
    {
        $category = $this->category->find($id);
        $category->update($data);

        return $category;
    }

    public function delete($id)
    {
        $category = $this->find($id);

        return $category->delete();
    }

    public function listTrashed()
    {
        return $this->category->onlyTrashed()->get();
    }

    public function restore($id)
    {
        $category = $this->category->onlyTrashed()->find($id);

        $category->restore();

        return $category;
    }
}
