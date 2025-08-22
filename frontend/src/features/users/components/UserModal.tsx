import { useEffect, useMemo, type FunctionComponent } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { createUser, updateUser } from "../userSlice";
import { fetchClients } from "../../clients/clientSlice";
import {
    ROLES,
    type User,
    type NewUserPayload,
    REQUEST_STATUSES,
    type UserUpdatePayload,
} from "../../../types/index";

interface UserModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

// --- Zod Schemas ---

// Schema for creating a new user (password is required)
const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(ROLES),
    client_id: z.uuid().optional(),
});

// Schema for updating an existing user (all fields are optional)
const updateUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.email("Invalid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    role: z.enum(ROLES).optional(),
    client_id: z.uuid().optional(),
});


export const UserModal: FunctionComponent<UserModalProps> = ({
    open,
    onClose,
    user,
}) => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.auth.user);
    const { items: clients, status: clientStatus } = useAppSelector(
        (state) => state.clients
    );

    const isEditing = !!user;
    const isSystemAdmin = currentUser?.role === ROLES.SYSTEM_ADMIN;

    // Dynamically select the correct schema based on the mode (create vs. edit)
    const validationSchema = useMemo(() => isEditing ? updateUserSchema : createUserSchema, [isEditing]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<NewUserPayload | UserUpdatePayload>({
        resolver: zodResolver(validationSchema), // Use the dynamic schema
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: ROLES.STAFF,
            client_id: "",
        },
    });

    useEffect(() => {
        if (isSystemAdmin && open) {
            dispatch(fetchClients());
        }
        if (open) {
            // When opening, reset the form with the user's data or empty defaults
            reset({
                name: user?.name || "",
                email: user?.email || "",
                password: "", // Always clear password field
                role: user?.role || ROLES.STAFF,
                client_id: user?.client_id || "",
            });
        }
    }, [user, open, reset, isSystemAdmin, dispatch]);

    const onSubmit: SubmitHandler<NewUserPayload | UserUpdatePayload> = (data) => {
        // For client_admin, force the client_id to their own when creating.
        if (!isSystemAdmin && !isEditing && currentUser) {
            data.client_id = currentUser.client_id;
        }

        if (isEditing && user) {
            // Don't send the password field if it's empty
            if (!data.password) {
                delete data.password;
            }
            dispatch(updateUser({ id: user.id, data: data as UserUpdatePayload }));
        } else {
            dispatch(createUser(data as NewUserPayload));
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? "Edit User" : "Create New User"}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    {isSystemAdmin && (
                        <FormControl fullWidth margin="dense" error={!!errors.client_id}>
                            <InputLabel id="client-select-label">Client</InputLabel>
                            <Controller
                                name="client_id"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="client-select-label"
                                        label="Client"
                                        disabled={isEditing} // Can't change a user's client
                                    >
                                        {clientStatus === REQUEST_STATUSES.LOADING ? (
                                            <MenuItem disabled>Loading...</MenuItem>
                                        ) : (
                                            clients.map((client) => (
                                                <MenuItem key={client.id} value={client.id}>
                                                    {client.name}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                )}
                            />
                        </FormControl>
                    )}
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                autoFocus
                                margin="dense"
                                label="Full Name"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="dense"
                                label="Email Address"
                                type="email"
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="dense"
                                label={isEditing ? "New Password (optional)" : "Password"}
                                type="password"
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        )}
                    />
                    <FormControl fullWidth margin="dense" error={!!errors.role}>
                        <InputLabel id="role-select-label">Role</InputLabel>
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} labelId="role-select-label" label="Role">
                                    {Object.values(ROLES).map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {isEditing ? "Save Changes" : "Create"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};
