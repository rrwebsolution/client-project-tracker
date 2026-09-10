<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProjectController extends Controller
{
    /**
     * Sortable columns exposed to the API, mapped to a safe default direction.
     */
    private const SORTS = [
        'newest' => ['created_at', 'desc'],
        'oldest' => ['created_at', 'asc'],
        'client_name' => ['client_name', 'asc'],
        'project_name' => ['project_name', 'asc'],
        'start_date' => ['start_date', 'asc'],
        'due_date' => ['due_date', 'asc'],
        'priority' => ['priority', 'desc'],
    ];

    public function index(Request $request)
    {
        $query = Project::query();

        if ($search = $request->string('search')->trim()->value()) {
            $query->where(function ($inner) use ($search) {
                $inner->where('client_name', 'like', "%{$search}%")
                    ->orWhere('project_name', 'like', "%{$search}%");
            });
        }

        if ($status = $request->string('status')->value()) {
            $query->where('status', $status);
        }

        if ($priority = $request->string('priority')->value()) {
            $query->where('priority', $priority);
        }

        [$column, $direction] = self::SORTS[$request->string('sort')->value()] ?? self::SORTS['newest'];
        $query->orderBy($column, $direction);

        return ProjectResource::collection($query->get());
    }

    public function store(StoreProjectRequest $request)
    {
        $project = Project::create($request->validated());

        return ProjectResource::make($project)->response()->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Project $project)
    {
        return ProjectResource::make($project);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project->update($request->validated());

        return ProjectResource::make($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return response()->noContent();
    }
}
