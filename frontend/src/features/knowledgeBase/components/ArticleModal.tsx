import { useEffect, type FunctionComponent } from "react";
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
  MenuItem,
  Select,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { createArticle, updateArticle } from "../knowledgeBaseSlice";
import { fetchClients } from "../../clients/clientSlice";
import {
  REQUEST_STATUSES,
  ROLES,
  type KnowledgeArticle,
  type NewKnowledgeArticlePayload,
} from "../../../types/index";

interface ArticleModalProps {
  open: boolean;
  onClose: () => void;
  article: KnowledgeArticle | null;
}

// Define the validation schema for the article form
const articleSchema = z.object({
  title: z
    .string()
    .min(5, "Title is required and must be at least 5 characters"),
  content: z
    .string()
    .min(20, "Content is required and must be at least 20 characters"),
  tags: z.string().optional(), // Tags will be a comma-separated string
});

// Define the form data type for the article form
type ArticleFormData = Omit<NewKnowledgeArticlePayload, "tags"> & {
  tags?: string;
};

export const ArticleModal: FunctionComponent<ArticleModalProps> = ({
  open,
  onClose,
  article,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: clients, status: clientStatus } = useAppSelector(
    (state) => state.clients
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
  });

  const isEditing = !!article;
  const isSystemAdmin = user?.role === ROLES.SYSTEM_ADMIN;

  useEffect(() => {
    // Fetch clients if the user is a system admin and the modal is opening
    if (isSystemAdmin && open) {
      dispatch(fetchClients());
    }
    // Reset form when modal opens
    if (open) {
      if (article) {
        reset({
          title: article.title,
          content: article.content,
          tags: article.tags?.join(", "),
        });
      } else {
        reset({ title: "", content: "", tags: "" });
      }
    }
  }, [article, open, reset, isSystemAdmin, dispatch]);

  // Handle form submission
  const onSubmit: SubmitHandler<ArticleFormData> = (data) => {
    // Prepare the payload for submission
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
    };
    // Dispatch the appropriate action based on whether we're editing or creating
    if (isEditing && article) {
      dispatch(updateArticle({ id: article.id, data: payload }));
    } else {
      dispatch(createArticle(payload));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {isEditing ? "Edit Article" : "Create New Article"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {/* Conditionally render Client dropdown for System Admin */}
          {isSystemAdmin && !isEditing && (
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
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Title"
                fullWidth
                variant="outlined"
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Content"
                fullWidth
                multiline
                rows={10}
                variant="outlined"
                error={!!errors.content}
                helperText={errors.content?.message}
              />
            )}
          />
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Tags (comma-separated)"
                fullWidth
                variant="outlined"
              />
            )}
          />
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
