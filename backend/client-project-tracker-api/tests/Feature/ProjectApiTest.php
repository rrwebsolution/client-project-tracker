<?php

use App\Models\Project;

function validProjectPayload(array $overrides = []): array
{
    return array_merge([
        'client_name' => 'Acme Corporation',
        'project_name' => 'Website Revamp',
        'description' => 'A short project description.',
        'status' => 'Planning',
        'priority' => 'Medium',
        'start_date' => '2026-01-01',
        'due_date' => '2026-02-01',
    ], $overrides);
}

test('it lists all projects', function () {
    Project::factory()->count(3)->create();

    $response = $this->getJson('/api/projects');

    $response->assertOk()->assertJsonCount(3, 'data');
});

test('it shows a single project', function () {
    $project = Project::factory()->create();

    $response = $this->getJson("/api/projects/{$project->id}");

    $response->assertOk()->assertJsonPath('data.id', $project->id);
});

test('it returns 404 for an unknown project', function () {
    $response = $this->getJson('/api/projects/999');

    $response->assertNotFound();
});

test('it creates a project with valid data', function () {
    $response = $this->postJson('/api/projects', validProjectPayload());

    $response->assertCreated()
        ->assertJsonPath('data.client_name', 'Acme Corporation')
        ->assertJsonPath('data.status', 'Planning');

    $this->assertDatabaseHas('projects', ['client_name' => 'Acme Corporation']);
});

test('it requires client name, project name, status, priority, and dates', function () {
    $response = $this->postJson('/api/projects', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors([
            'client_name', 'project_name', 'status', 'priority', 'start_date', 'due_date',
        ]);
});

test('it rejects an invalid status value', function () {
    $response = $this->postJson('/api/projects', validProjectPayload(['status' => 'Cancelled']));

    $response->assertUnprocessable()->assertJsonValidationErrors('status');
});

test('it rejects an invalid priority value', function () {
    $response = $this->postJson('/api/projects', validProjectPayload(['priority' => 'Urgent']));

    $response->assertUnprocessable()->assertJsonValidationErrors('priority');
});

test('it rejects a due date earlier than the start date', function () {
    $response = $this->postJson('/api/projects', validProjectPayload([
        'start_date' => '2026-06-10',
        'due_date' => '2026-06-01',
    ]));

    $response->assertUnprocessable()->assertJsonValidationErrors('due_date');
});

test('it updates an existing project', function () {
    $project = Project::factory()->create(['status' => 'Planning']);

    $response = $this->putJson("/api/projects/{$project->id}", validProjectPayload([
        'status' => 'Completed',
    ]));

    $response->assertOk()->assertJsonPath('data.status', 'Completed');

    $this->assertDatabaseHas('projects', ['id' => $project->id, 'status' => 'Completed']);
});

test('it deletes a project', function () {
    $project = Project::factory()->create();

    $response = $this->deleteJson("/api/projects/{$project->id}");

    $response->assertNoContent();
    $this->assertDatabaseMissing('projects', ['id' => $project->id]);
});
