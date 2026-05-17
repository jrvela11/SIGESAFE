<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Empleado;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('empleado')->withTrashed()->orderBy('id', 'desc')->get();
        
        return response()->json([
            'success' => true,
            'data'    => UserResource::collection($users)
        ], 200);
    }

    public function store(StoreUserRequest $request)
    {
        $userData = $request->safe()->except(['empleado_id']);
        
        $user = User::create($userData);

        if ($request->filled('empleado_id')) {
            Empleado::where('id', $request->empleado_id)->update(['user_id' => $user->id]);
        }

        $user->load('empleado');

        return response()->json([
            'success' => true,
            'message' => 'Usuario creado exitosamente',
            'data'    => new UserResource($user)
        ], 201);
    }

    public function show(User $user)
    {
        $user->load('empleado');

        return response()->json([
            'success' => true,
            'data'    => new UserResource($user)
        ], 200);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $userData = $request->safe()->except(['empleado_id']);

        // Limpiamos el password si viene vacío para no sobreescribirlo
        if (empty($userData['password'])) {
            unset($userData['password']);
        }

        $user->update($userData);

        if ($request->has('empleado_id')) {
            Empleado::where('user_id', $user->id)->update(['user_id' => null]);
            
            if ($request->filled('empleado_id')) {
                Empleado::where('id', $request->empleado_id)->update(['user_id' => $user->id]);
            }
        }

        $user->load('empleado');

        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado con éxito',
            'data'    => new UserResource($user)
        ], 200);
    }

    public function destroy(User $user)
    {
        $user->update(['is_active' => false]);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario desactivado'
        ], 200);
    }

    public function restaurar(int $id)
    {
        $user = User::withTrashed()->findOrFail($id);
        
        $user->restore();
        $user->update(['is_active' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario reactivado con éxito'
        ], 200);
    }
}