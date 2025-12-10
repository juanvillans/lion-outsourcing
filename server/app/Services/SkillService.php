<?php

namespace App\Services;

use App\Models\Skill;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class SkillService
{
    public function searchSkills($params = [])
    {
        $defaultParams = [
            'page' => 1,
            'per_page' => 15,
        ];

        $params = array_merge($defaultParams, $params);


        if (
            empty($params['search']) &&
            empty($params['starts_with']) &&
            empty($params['ends_with'])
        ) {
            return new \Illuminate\Pagination\LengthAwarePaginator(
                [],
                0,
                $params['per_page'],
                $params['page']
            );
        }

        $query = Skill::query();
        $this->applySearchFilters($query, $params);


        if (!empty($params['search'])) {
            $this->applyRelevanceOrdering($query, $params['search']);
        } else {

            $query->orderBy('name', 'asc');
        }

        return $this->applyPagination($query, $params);
    }

    private function applySearchFilters($query, $params)
    {

        if (!empty($params['search'])) {
            $searchTerm = $params['search'];
            $searchTerms = preg_split('/\s+/', $searchTerm, -1, PREG_SPLIT_NO_EMPTY);

            $query->where(function ($q) use ($searchTerms) {
                foreach ($searchTerms as $term) {

                    $q->where(DB::raw('LOWER(name)'), 'LIKE', '%' . strtolower($term) . '%');
                }
            });
        }


        if (!empty($params['starts_with']) || !empty($params['ends_with'])) {
            $query->orWhere(function ($q) use ($params) {
                if (!empty($params['starts_with'])) {
                    $q->orWhere(DB::raw('LOWER(name)'), 'LIKE', strtolower($params['starts_with']) . '%');
                }

                if (!empty($params['ends_with'])) {
                    $q->orWhere(DB::raw('LOWER(name)'), 'LIKE', '%' . strtolower($params['ends_with']));
                }
            });
        }
    }

    private function applyRelevanceOrdering($query, string $searchTerm): void
    {
        $searchTermLower = strtolower($searchTerm);
        $searchTerms = preg_split('/\s+/', $searchTermLower, -1, PREG_SPLIT_NO_EMPTY);

        $cases = [];
        $bindings = [];

        $cases[] = "WHEN LOWER(name) = ? THEN 100";
        $bindings[] = $searchTermLower;

        $cases[] = "WHEN LOWER(name) LIKE ? THEN 90";
        $bindings[] = $searchTermLower . '%';

        $cases[] = "WHEN LOWER(name) LIKE ? THEN 80";
        $bindings[] = '%' . $searchTermLower . '%';

        foreach ($searchTerms as $index => $term) {
            if (strlen($term) > 2) {
                $score = 70 - ($index * 5);
                $cases[] = "WHEN LOWER(name) LIKE ? THEN ?";
                $bindings[] = '%' . $term . '%';
                $bindings[] = $score;
            }
        }

        $cases[] = "WHEN LENGTH(name) < 15 THEN 5";
        $cases[] = "ELSE 0 END as relevance_score";

        $caseSql = "CASE\n" . implode("\n", $cases);

        $query->selectRaw("skills.*, $caseSql", $bindings)
            ->orderBy('relevance_score', 'desc')
            ->orderBy('name', 'asc');
    }

    private function applyPagination($query, array $params): LengthAwarePaginator
    {
        $perPage = max(1, min(100, (int)$params['per_page']));
        $page = max(1, (int)$params['page']);

        return $query->paginate($perPage, ['*'], 'page', $page);
    }
}
