<?php
namespace App\Models;

class Query
{

    public static function filters($query, $conditions)
    {
        if (! empty($conditions)) {
            foreach ($conditions as $condition) {
                $column   = $condition[0];
                $operator = strtolower($condition[1]);

                switch ($operator) {
                    case 'between':
                        $query->whereBetween($column, $condition[2]);
                        break;

                    case 'not between':
                        $query->whereNotBetween($column, $condition[2]);
                        break;

                    case 'null':
                        $query->whereNull($column);
                        break;

                    case 'not null':
                        $query->whereNotNull($column);
                        break;

                    case 'like':
                        $query->where($column, 'LIKE', $condition[2]);
                        break;

                    case 'not like':
                        $query->where($column, 'NOT LIKE', $condition[2]);
                        break;

                    case 'in':
                        $query->whereIn($column, $condition[2]);
                        break;

                    case 'not in':
                        $query->whereNotIn($column, $condition[2]);
                        break;

                    default:
                        if (isset($condition[3]) && strtolower($condition[3]) == 'or') {
                            $query->orWhere($column, $operator, $condition[2]);
                        } else {
                            $query->where($column, $operator, $condition[2]);
                        }
                        break;
                }
            }
        }

        return $query;
    }
}
