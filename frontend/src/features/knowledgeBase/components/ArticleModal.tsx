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
} from "@mui/material";
import { useAppDispatch } from "../../../store/hooks";
import { createArticle, updateArticle } from "../knowledgeBaseSlice";
import type {
  KnowledgeArticle,
  NewKnowledgeArticlePayload,
} from "../../../types/index";

interface ArticleModalProps {
  open: boolean;
  onClose: () => void;
  article: KnowledgeArticle | null;
}

const articleSchema = z.object({
  title: z
    .string()
    .min(5, "Title is required and must be at least 5 characters"),
  content: z
    .string()
    .min(20, "Content is required and must be at least 20 characters"),
  tags: z.string().optional(), // Tags will be a comma-separated string
});

type ArticleFormData = Omit<NewKnowledgeArticlePayload, "tags"> & {
  tags?: string;
};

export const ArticleModal: FunctionComponent<ArticleModalProps> = ({
  open,
  onClose,
  article,
}) => {
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
  });

  const isEditing = !!article;

  useEffect(() => {
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
  }, [article, open, reset]);

  const onSubmit: SubmitHandler<ArticleFormData> = (data) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
    };

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
