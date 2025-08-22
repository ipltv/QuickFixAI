import { useEffect, useState, type FunctionComponent } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

import {
  deleteArticle,
  fetchArticles,
} from "../features/knowledgeBase/knowledgeBaseSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { REQUEST_STATUSES, type KnowledgeArticle } from "../types/index";

import { ArticleList } from "../features/knowledgeBase/components/ArticleList";
import { ArticleModal } from "../features/knowledgeBase/components/ArticleModal";

export const KnowledgeBasePage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { articles, status, error } = useAppSelector(
    (state) => state.knowledgeBase
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(
    null
  );

  useEffect(() => {
    if (status === REQUEST_STATUSES.IDLE) {
      dispatch(fetchArticles());
    }
  }, [status, dispatch]);

  const handleOpenModal = (article: KnowledgeArticle | null = null) => {
    setEditingArticle(article);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingArticle(null);
  };

  const handleDelete = (articleId: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      dispatch(deleteArticle(articleId));
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Knowledge Base Management
        </Typography>
        <Button variant="contained" onClick={() => handleOpenModal()}>
          Add New Article
        </Button>
      </Box>

      {status === REQUEST_STATUSES.LOADING && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {status === REQUEST_STATUSES.SUCCEEDED && (
        <ArticleList
          articles={articles}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      <ArticleModal
        open={modalOpen}
        onClose={handleCloseModal}
        article={editingArticle}
      />
    </Box>
  );
};
