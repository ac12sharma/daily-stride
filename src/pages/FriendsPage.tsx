import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Check, X, Users, Footprints } from "lucide-react";
import { useFriends, type SearchResult } from "@/hooks/useFriends";

export default function FriendsPage() {
  const {
    friends,
    pendingRequests,
    loading,
    searchUsers,
    sendRequest,
    acceptRequest,
    declineRequest,
  } = useFriends();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const results = await searchUsers(q);
    setSearchResults(results);
    setSearching(false);
  };

  const handleSend = async (userId: string) => {
    await sendRequest(userId);
    setSentIds((prev) => new Set(prev).add(userId));
  };

  return (
    <div className="min-h-dvh app-bg px-5 pt-14 pb-28 max-w-md mx-auto select-none">
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          className="font-display text-xl font-bold text-foreground"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Friends
        </motion.h1>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 glass-card rounded-xl press-effect"
        >
          {showSearch ? (
            <X className="h-5 w-5 text-muted-foreground" />
          ) : (
            <UserPlus className="h-5 w-5 text-primary" />
          )}
        </button>
      </div>

      {/* Search */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="mb-6 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full glass-card rounded-2xl py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/30 bg-transparent"
              />
            </div>

            {searching && (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <motion.div
                    key={result.user_id}
                    className="flex items-center gap-3 p-3 glass-card rounded-2xl"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground overflow-hidden">
                      {result.avatar_url ? (
                        <img
                          src={result.avatar_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        result.display_name?.charAt(0)?.toUpperCase() || "?"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {result.display_name || "Anonymous"}
                      </p>
                    </div>
                    {result.already_friend || sentIds.has(result.user_id) ? (
                      <span className="text-xs text-muted-foreground px-3 py-1.5 glass-card rounded-full">
                        {result.already_friend ? "Friends" : "Sent"}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSend(result.user_id)}
                        className="bg-primary/15 text-primary px-3 py-1.5 rounded-full text-xs font-semibold press-effect"
                      >
                        Add
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 &&
              !searching &&
              searchResults.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-4">
                  No users found
                </p>
              )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
            Friend Requests ({pendingRequests.length})
          </p>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <motion.div
                key={req.friendship_id}
                className="flex items-center gap-3 p-3 glass-card-elevated rounded-2xl"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground overflow-hidden">
                  {req.avatar_url ? (
                    <img
                      src={req.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    req.display_name?.charAt(0)?.toUpperCase() || "?"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {req.display_name || "Anonymous"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    wants to be friends
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptRequest(req.friendship_id)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/15 text-primary press-effect"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => declineRequest(req.friendship_id)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-destructive/15 text-destructive press-effect"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Friends list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : friends.length === 0 ? (
        <div className="text-center text-muted-foreground text-sm mt-16">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No friends yet</p>
          <p className="text-xs mt-1">
            Tap <span className="text-primary">+</span> to find and add friends
          </p>
        </div>
      ) : (
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
            Your Friends ({friends.length})
          </p>
          <div className="space-y-2">
            {friends.map((friend, i) => (
              <motion.div
                key={friend.friendship_id}
                className="flex items-center gap-3 p-4 glass-card rounded-2xl"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground overflow-hidden">
                  {friend.avatar_url ? (
                    <img
                      src={friend.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    friend.display_name?.charAt(0)?.toUpperCase() || "?"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {friend.display_name || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Footprints className="h-3 w-3 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      {friend.steps_today.toLocaleString()} steps today
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
