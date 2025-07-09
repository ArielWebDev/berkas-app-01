<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Nasabah;
use Inertia\Inertia;

class NasabahController extends Controller
{
    public function index(Request $request)
    {
        $query = Nasabah::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama_lengkap', 'like', '%' . $request->search . '%')
                    ->orWhere('nik', 'like', '%' . $request->search . '%')
                    ->orWhere('nomor_wa', 'like', '%' . $request->search . '%')
                    ->orWhere('alamat', 'like', '%' . $request->search . '%');
            });
        }

        $nasabah = $query->withCount('pinjaman')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Nasabah/Index', [
            'nasabah' => [
                'data' => $nasabah,
                'meta' => [
                    'total' => $nasabah->count(),
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => $nasabah->count(),
                ],
                'links' => []
            ],
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Nasabah/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:nasabah,nik',
            'alamat' => 'required|string',
            'nomor_wa' => 'required|string|max:20',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:L,P',
            'pekerjaan' => 'nullable|string|max:100',
            'penghasilan' => 'nullable|string',
            'status_perkawinan' => 'nullable|in:belum_menikah,menikah,cerai_hidup,cerai_mati',
            'nama_ibu_kandung' => 'nullable|string|max:255',
            'agama' => 'nullable|in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu',
        ]);

        // Convert penghasilan from formatted string to integer
        if ($validated['penghasilan']) {
            $validated['penghasilan'] = (int) str_replace('.', '', $validated['penghasilan']);
        }

        Nasabah::create($validated);

        return redirect()->route('nasabah.index')->with('success', 'Nasabah berhasil ditambahkan');
    }

    public function show(Nasabah $nasabah)
    {
        $nasabah->load(['pinjaman.logPinjaman.user']);

        return Inertia::render('Nasabah/Show', [
            'nasabah' => $nasabah
        ]);
    }

    public function edit(Nasabah $nasabah)
    {
        return Inertia::render('Nasabah/Edit', [
            'nasabah' => $nasabah
        ]);
    }

    public function update(Request $request, Nasabah $nasabah)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:nasabah,nik,' . $nasabah->id,
            'alamat' => 'required|string',
            'nomor_wa' => 'required|string|max:20',
            'tempat_lahir' => 'nullable|string|max:100',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:L,P',
            'pekerjaan' => 'nullable|string|max:100',
            'penghasilan' => 'nullable|string',
            'status_perkawinan' => 'nullable|in:belum_menikah,menikah,cerai_hidup,cerai_mati',
            'nama_ibu_kandung' => 'nullable|string|max:255',
            'agama' => 'nullable|in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu',
        ]);

        // Convert penghasilan from formatted string to integer
        if ($validated['penghasilan']) {
            $validated['penghasilan'] = (int) str_replace('.', '', $validated['penghasilan']);
        }

        $nasabah->update($validated);

        return redirect()->route('nasabah.index')->with('success', 'Nasabah berhasil diupdate');
    }

    public function destroy(Nasabah $nasabah)
    {
        // Check if nasabah has active pinjaman
        if ($nasabah->pinjaman()->whereNotIn('status', ['disetujui', 'ditolak'])->exists()) {
            return back()->with('error', 'Tidak dapat menghapus nasabah yang memiliki pinjaman aktif');
        }

        $nasabah->delete();

        return redirect()->route('nasabah.index')->with('success', 'Nasabah berhasil dihapus');
    }
}
