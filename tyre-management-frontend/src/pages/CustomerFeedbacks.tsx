import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  getAllFeedbacks,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from "@/api/feedbackApi";
import { toast } from "sonner";

export interface Feedback {
  id: string;
  customerId: string;
  type: string;
  numOfStars: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

const CustomerFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
  const [newFeedback, setNewFeedback] = useState({
    type: "",
    numOfStars: 0,
    comment: "",
  });
  const customerId = localStorage.getItem("userId");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const data = await getAllFeedbacks();
    setFeedbacks(data);
  };

  const handleCreateFeedback = async () => {
    if (!newFeedback.type) {
      alert("Please select a feedback type.");
      return;
    }
    if (newFeedback.numOfStars === 0) {
      alert("Please rate your experience.");
      return;
    }
    if (!newFeedback.comment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    try {
      await createFeedback({ ...newFeedback, customerId: customerId! });
      setIsDialogOpen(false);
      setNewFeedback({ type: "", numOfStars: 0, comment: "" });
      await fetchFeedbacks();
      toast.success("Feedback sent successfully");
    } catch (error) {
      console.error(error);
      toast.error("Somethin went wrong,please try again");
    }
  };

  const handleUpdateFeedback = async () => {
    if (!editingFeedback) return;

    if (!editingFeedback.type) {
      alert("Please select a feedback type.");
      return;
    }
    if (editingFeedback.numOfStars === 0) {
      alert("Please rate your experience.");
      return;
    }

    if (!editingFeedback.comment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    const { id, customerId, customer, ...feedbackData } = editingFeedback;
    try {
      await updateFeedback(id, { ...feedbackData });
      setEditingFeedback(null);
      await fetchFeedbacks();
      toast.success("Feedback updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Somethin went wrong,please try again");
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      await deleteFeedback(id);
      await fetchFeedbacks();
      toast.success("Feedback deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Somethin went wrong,please try again");
    }
  };

  const renderStars = (
    numOfStars: number,
    isEditable = false,
    onChange?: (stars: number) => void
  ) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer ${
              star <= numOfStars
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400"
            }`}
            onClick={() => isEditable && onChange?.(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="dark bg-blue-950 text-white min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Feedbacks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-white">
              <Plus className="mr-2" /> Create Feedback
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Feedback</DialogTitle>
              <DialogDescription>
                Share your feedback with us.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select
                onValueChange={(value) =>
                  setNewFeedback({ ...newFeedback, type: value })
                }
              >
                <SelectTrigger
                  className="bg-white"
                  style={{ background: "white" }}
                >
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tyer">Tyer</SelectItem>
                  <SelectItem value="wheel">Wheel</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <p className="text-sm mb-2">Rate your experience:</p>
                {renderStars(newFeedback.numOfStars, true, (stars) =>
                  setNewFeedback({ ...newFeedback, numOfStars: stars })
                )}
              </div>
              <Textarea
                placeholder="Comment"
                value={newFeedback.comment}
                onChange={(e) =>
                  setNewFeedback({ ...newFeedback, comment: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateFeedback}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedbacks.map((feedback) => (
          <motion.div key={feedback.id} whileHover={{ scale: 1.05 }}>
            <Card className="dark bg-black text-white">
              <CardHeader>
                <CardTitle>{feedback.type}</CardTitle>
                <CardDescription>
                  {renderStars(feedback.numOfStars)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{feedback.comment}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                {customerId === feedback.customerId && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setEditingFeedback(feedback)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteFeedback(feedback.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {editingFeedback && (
        <Dialog
          open={!!editingFeedback}
          onOpenChange={(open) => !open && setEditingFeedback(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Feedback</DialogTitle>
              <DialogDescription>Update your feedback.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Select
                value={editingFeedback.type}
                onValueChange={(value) =>
                  setEditingFeedback({ ...editingFeedback, type: value })
                }
              >
                <SelectTrigger
                  className="bg-white"
                  style={{ background: "white" }}
                >
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tyer">Tyer</SelectItem>
                  <SelectItem value="wheel">Wheel</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <p className="text-sm mb-2">Rate your experience:</p>
                {renderStars(editingFeedback.numOfStars, true, (stars) =>
                  setEditingFeedback({ ...editingFeedback, numOfStars: stars })
                )}
              </div>
              <Textarea
                placeholder="Comment"
                value={editingFeedback.comment}
                onChange={(e) =>
                  setEditingFeedback({
                    ...editingFeedback,
                    comment: e.target.value,
                  })
                }
              />
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateFeedback}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CustomerFeedbacks;
