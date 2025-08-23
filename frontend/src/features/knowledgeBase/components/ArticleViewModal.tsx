import type { FunctionComponent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import type { KnowledgeArticle } from "../../../types/index";

interface ArticleViewModalProps {
  open: boolean;
  onClose: () => void;
  article: KnowledgeArticle | null;
}

export const ArticleViewModal: FunctionComponent<ArticleViewModalProps> = ({
  open,
  onClose,
  article,
}) => {
  if (!article) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{article.title}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" component="h3" gutterBottom>
            Tags
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {article.tags?.join(", ") || "None"}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          component="div"
          sx={{ whiteSpace: "pre-wrap" }} // This preserves formatting like newlines
        >
          {article.content}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
