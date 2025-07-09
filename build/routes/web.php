<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PinjamanController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NasabahController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\WorkflowController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('WelcomeModern', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'auth' => [
            'user' => Auth::user()
        ]
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/workflow', [WorkflowController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('workflow');
// Route::get('/modern-dashboard', function () {
//     return Inertia::render('ModernWorkflowDashboard', [
//         'auth' => ['user' => Auth::user()],
//         'stats' => [
//             'total' => 45,
//             'pending' => 12,
//             'inReview' => 8,
//             'approved' => 20,
//             'rejected' => 5,
//         ],
//         'workflowItems' => [
//             [
//                 'id' => 1,
//                 'title' => 'Personal Loan - John Doe',
//                 'applicant' => 'John Doe',
//                 'amount' => 50000000,
//                 'status' => 'in_review',
//                 'currentStep' => 'Risk Assessment',
//                 'priority' => 'high',
//                 'createdAt' => '2024-01-15T10:30:00Z',
//                 'updatedAt' => '2024-01-17T09:15:00Z',
//                 'assignedTo' => 'Risk Analyst',
//                 'lockedBy' => null,
//             ],
//             [
//                 'id' => 2,
//                 'title' => 'Business Loan - PT ABC',
//                 'applicant' => 'PT ABC Company',
//                 'amount' => 150000000,
//                 'status' => 'pending',
//                 'currentStep' => 'Document Verification',
//                 'priority' => 'urgent',
//                 'createdAt' => '2024-01-16T14:20:00Z',
//                 'updatedAt' => '2024-01-16T14:20:00Z',
//                 'assignedTo' => 'Document Reviewer',
//                 'lockedBy' => 'Admin User',
//             ],
//             [
//                 'id' => 3,
//                 'title' => 'Mortgage - Jane Smith',
//                 'applicant' => 'Jane Smith',
//                 'amount' => 250000000,
//                 'status' => 'approved',
//                 'currentStep' => 'Final Approval',
//                 'priority' => 'medium',
//                 'createdAt' => '2024-01-10T08:45:00Z',
//                 'updatedAt' => '2024-01-18T16:30:00Z',
//                 'assignedTo' => 'Manager',
//                 'lockedBy' => null,
//             ],
//         ],
//         'userActions' => [
//             [
//                 'id' => 'approve',
//                 'label' => 'Approve Application',
//                 'description' => 'Approve this application for next step',
//                 'variant' => 'success',
//                 'requiresComment' => true,
//             ],
//             [
//                 'id' => 'reject',
//                 'label' => 'Reject Application',
//                 'description' => 'Reject this application',
//                 'variant' => 'danger',
//                 'requiresComment' => true,
//                 'confirmMessage' => 'Are you sure you want to reject this application? This action cannot be undone.',
//             ],
//             [
//                 'id' => 'request_info',
//                 'label' => 'Request More Information',
//                 'description' => 'Ask for additional documents or information',
//                 'variant' => 'warning',
//                 'requiresComment' => true,
//             ],
//         ],
//     ]);
// })->middleware(['auth', 'verified'])->name('modern-dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Workflow Routes
    Route::prefix('pinjaman')->name('pinjaman.')->group(function () {
        // Index - daftar pinjaman (semua role bisa akses)
        Route::get('/', [PinjamanController::class, 'index'])->name('index');

        // Tahap 1: Create routes (sementara tanpa middleware untuk development)
        Route::get('/create', [PinjamanController::class, 'create'])->name('create');
        Route::get('/create/wizard', [PinjamanController::class, 'createWizard'])->name('create.wizard');
        Route::get('/create/wizard-new', [PinjamanController::class, 'createWizardNew'])->name('create.wizard-new');
        Route::post('/', [PinjamanController::class, 'store'])->name('store');
        Route::post('/wizard', [PinjamanController::class, 'storeWizard'])->name('store.wizard');

        // Workflow Action Routes
        Route::post('/{pinjaman}/take', [WorkflowController::class, 'takePinjaman'])->name('take');
        Route::post('/{pinjaman}/release', [WorkflowController::class, 'releasePinjaman'])->name('release');
        Route::post('/{pinjaman}/advance', [WorkflowController::class, 'advancePinjaman'])->name('advance');
        Route::post('/{pinjaman}/return', [WorkflowController::class, 'returnPinjaman'])->name('return');
        Route::post('/{pinjaman}/decide', [WorkflowController::class, 'finalDecision'])->name('decide');

        // View detail - semua role bisa lihat
        Route::get('/{pinjaman}', [PinjamanController::class, 'show'])->name('show');

        // Edit routes
        Route::get('/{pinjaman}/edit', [PinjamanController::class, 'edit'])->name('edit');
        Route::put('/{pinjaman}', [PinjamanController::class, 'update'])->name('update');
        Route::delete('/{pinjaman}', [PinjamanController::class, 'destroy'])->name('destroy');

        // Tahap 2: Admin Kredit routes (sementara tanpa middleware)
        Route::post('/{pinjaman}/workflow-action', [PinjamanController::class, 'workflowAction'])->name('workflow-action');
        Route::post('/{pinjaman}/lock', [PinjamanController::class, 'lockBerkas'])->name('lock');
        Route::post('/{pinjaman}/upload-ojk', [PinjamanController::class, 'uploadDokumenOjk'])->name('upload-ojk');
        Route::post('/{pinjaman}/admin-decision', [PinjamanController::class, 'adminDecision'])->name('admin-decision');

        // Tahap 3: Analis routes (sementara tanpa middleware)
        Route::post('/{pinjaman}/assign-analis', [PinjamanController::class, 'assignToAnalis'])->name('assign-analis');
        Route::post('/{pinjaman}/upload-lapangan', [PinjamanController::class, 'uploadDokumenLapangan'])->name('upload-lapangan');
        Route::post('/{pinjaman}/finish-analysis', [PinjamanController::class, 'finishAnalysis'])->name('finish-analysis');

        // Tahap 4: Pemutus routes (sementara tanpa middleware)
        Route::post('/{pinjaman}/final-decision', [PinjamanController::class, 'finalDecision'])->name('final-decision');
    });

    // Berkas management routes
    Route::get('/berkas/{berkas}/download', [PinjamanController::class, 'downloadBerkas'])->name('berkas.download');
    Route::get('/berkas/{berkas}/view', [PinjamanController::class, 'viewBerkas'])->name('berkas.view');
    Route::delete('/berkas/{berkas}', [PinjamanController::class, 'deleteBerkas'])->name('berkas.delete');
});

// User Management (sementara tanpa middleware)
Route::resource('users', UserController::class);

// Nasabah Management (sementara tanpa middleware)
Route::resource('nasabah', NasabahController::class);

// Reports (sementara tanpa middleware)
Route::get('/reports', [ReportsController::class, 'index'])->name('reports.index');
Route::post('/reports/export', [ReportsController::class, 'export'])->name('reports.export');


require __DIR__ . '/auth.php';