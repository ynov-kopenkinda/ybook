import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { CenterLoader, Loader } from "../components/default/Loader";
import { PostPreview } from "../components/posts/PostPreview";
import { usePosts } from "../hooks/posts/usePosts";
import cx from "classnames";
import { IconGlobe, IconUsers } from "@tabler/icons-react";

const HomePage = () => {
  const [friendsOnly, setFriendsOnly] = useState(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
  } = usePosts({ friendsOnly });
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView]);
  return (
    <div className="flex flex-col gap-2">
      <h1 className="mb-4 text-4xl font-black">Home</h1>
      <div className="flex items-center gap-2">
        <button
          className={cx(
            "flex w-full items-center justify-center gap-1 rounded-md bg-white p-2",
            {
              "border font-bold": !friendsOnly,
            }
          )}
          onClick={() => setFriendsOnly(false)}
        >
          All <IconGlobe stroke={friendsOnly ? 1 : 2} size={18} />
        </button>
        <button
          className={cx(
            "flex w-full items-center justify-center gap-1 rounded-md bg-white p-2",
            {
              "border font-bold": friendsOnly,
            }
          )}
          onClick={() => setFriendsOnly(true)}
        >
          Friends Only <IconUsers stroke={!friendsOnly ? 1 : 2} size={18} />
        </button>
      </div>
      {data?.pages.map((page, pageIdx) =>
        page.posts.map((post, postIdx) => (
          <PostPreview
            post={post}
            key={post.id}
            ref={
              pageIdx === data.pages.length - 1 &&
              postIdx === page.posts.length - 1
                ? ref
                : undefined
            }
          />
        ))
      )}
      {isInitialLoading && <CenterLoader />}
      {isFetchingNextPage && (
        <div className="flex h-12 items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default HomePage;
