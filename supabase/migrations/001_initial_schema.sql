-- Longview Community Hub - Initial Schema

-- Profiles (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    karma_posts INTEGER DEFAULT 0 NOT NULL,
    karma_comments INTEGER DEFAULT 0 NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin', 'staff')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Series (podcast series)
CREATE TABLE series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    rss_feed_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Episodes (from RSS feeds)
CREATE TABLE episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_id UUID REFERENCES series(id) ON DELETE CASCADE,
    guid TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL,
    duration_seconds INTEGER,
    transcript TEXT,
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Posts (discussions)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    series_id UUID REFERENCES series(id) ON DELETE SET NULL,
    upvote_count INTEGER DEFAULT 0 NOT NULL,
    comment_count INTEGER DEFAULT 0 NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comments (nested)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    body TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    depth INTEGER DEFAULT 0 NOT NULL,
    upvote_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Votes
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT vote_target CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    ),
    UNIQUE (user_id, post_id),
    UNIQUE (user_id, comment_id)
);

-- Indexes
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_episodes_series ON episodes(series_id);
CREATE INDEX idx_episodes_published ON episodes(published_at DESC);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, username, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update karma on vote
CREATE OR REPLACE FUNCTION handle_vote_change()
RETURNS TRIGGER AS $$
DECLARE
    author_id UUID;
    delta INTEGER;
BEGIN
    delta := CASE WHEN TG_OP = 'INSERT' THEN 1 ELSE -1 END;

    IF COALESCE(NEW.post_id, OLD.post_id) IS NOT NULL THEN
        SELECT p.author_id INTO author_id FROM posts p WHERE p.id = COALESCE(NEW.post_id, OLD.post_id);
        UPDATE posts SET upvote_count = upvote_count + delta WHERE id = COALESCE(NEW.post_id, OLD.post_id);
        IF author_id IS NOT NULL THEN
            UPDATE profiles SET karma_posts = karma_posts + delta WHERE id = author_id;
        END IF;
    ELSE
        SELECT c.author_id INTO author_id FROM comments c WHERE c.id = COALESCE(NEW.comment_id, OLD.comment_id);
        UPDATE comments SET upvote_count = upvote_count + delta WHERE id = COALESCE(NEW.comment_id, OLD.comment_id);
        IF author_id IS NOT NULL THEN
            UPDATE profiles SET karma_comments = karma_comments + delta WHERE id = author_id;
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_vote_change
    AFTER INSERT OR DELETE ON votes
    FOR EACH ROW EXECUTE FUNCTION handle_vote_change();

-- Update comment count
CREATE OR REPLACE FUNCTION handle_comment_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_change
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION handle_comment_change();

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read" ON series FOR SELECT USING (true);
CREATE POLICY "Public read" ON episodes FOR SELECT USING (true);
CREATE POLICY "Public read" ON posts FOR SELECT USING (true);
CREATE POLICY "Public read" ON comments FOR SELECT USING (true);
CREATE POLICY "Public read" ON votes FOR SELECT USING (true);

-- Authenticated users can create
CREATE POLICY "Auth insert" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Auth insert" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Auth insert" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update/delete their own
CREATE POLICY "Own update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Own update" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Own delete" ON posts FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "Own update" ON comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Own delete" ON votes FOR DELETE USING (auth.uid() = user_id);
