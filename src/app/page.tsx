"use client";
import {
  Banner,
  Wrapper,
  Flex,
  FlexWrap,
  Card,
  Loader,
  Search,
  Button,
} from "mfg-ui-components";
import { getAll, searchApi } from "./apiServices/apiServices";
import { use, Suspense, useState, useEffect } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { clear } from "console";

const promiseCache = new Map<string, Promise<unknown>>();
function useQuery<T>({ fn, key }: { fn: () => Promise<T>; key: string }) {
  if (!promiseCache.has(key)) {
    promiseCache.set(key, fn());
  }
  const promisres = promiseCache.get(key) as Promise<T>;
  const result = use(promisres);
  return result;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [handalSelect, setHandleSelect] = useState<
    { id: number; title: any; timestamp: string }[]
  >([]);

  const data = useQuery({
    fn: () => getAll(),
    key: "allData",
  });
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyUp = () => {
    searchApi(searchQuery).then((result) => {
      setDataSearch(result);
    });
  };
  const clearSearch = () => {
    setSearchQuery("");
    setDataSearch([]);
  };

  const handleSelectChange = (item: any) => {
    let newItm = {
      id: Date.now(),
      title: item.name,
      timestamp: new Date().toLocaleString(),
    };
    setHandleSelect((prev) => [newItm, ...prev]);
    localStorage.setItem(
      "selectedItems",
      JSON.stringify([newItm, ...handalSelect]),
    );
  };
  useEffect(() => {
    const storedItems = localStorage.getItem("selectedItems");
    if (storedItems) {
      setHandleSelect(JSON.parse(storedItems));
    }
  }, []);

  const clearSelectedItems = () => {
    setHandleSelect([]);
    localStorage.removeItem("selectedItems");
  };

  return (
    <main>
      <Suspense
        fallback={<Loader loaderBackground="darkerOverlay">Loading...</Loader>}
      >
        <ErrorBoundary>
          <Banner
            bannerImage={
              "https://images.pexels.com/photos/8108188/pexels-photo-8108188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            }
            alterText="Recipe"
            bannerSize="half"
            bannerOverlay="lightOverlay"
          />
          <Wrapper wrapClass="fixWrap">
            <FlexWrap FlexWrap="wrap">
              <Flex FlexWidth="full-col" CustomClass={"marginBottom"}>
                <Search
                  searchChange={handleSearchChange}
                  searchkeyUp={handleSearchKeyUp}
                  clearSearchList={clearSearch}
                  searchPlaceholder="Search The recipes..."
                  searchClass="searchSection"
                >
                  {dataSearch.map((item: any) => {
                    return (
                      <>
                        <Button
                          link={`/single/${item.id}`}
                          key={item.id}
                          onClick={() => handleSelectChange(item)}
                        >
                          <Card
                            key={item.id}
                            cardHeading={item.name}
                            CardImagePath={item.image}
                            CardImageAlt={item.name}
                            CardView="mfg-list"
                          />
                        </Button>
                      </>
                    );
                  })}
                </Search>
                <>
                  {handalSelect.length > 0 && (
                    <h4
                      style={{
                        marginBottom: "20px",
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      Selected History
                      <Button
                        onClick={clearSelectedItems}
                        ButtonClass="mfg-danger"
                      >
                        Clear History
                      </Button>
                    </h4>
                  )}
                  {handalSelect.map((item) => {
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid #ccc",
                          padding: "10px 0",
                        }}
                      >
                        <h5>{item.title}</h5>
                        <div>
                          {" "}
                          <span
                            style={{ fontSize: "11px", marginRight: "20px" }}
                          >
                            {item.timestamp}
                          </span>
                          <Button
                            onClick={() =>
                              setHandleSelect((prev) =>
                                prev.filter((itm) => itm.id !== item.id),
                              )
                            }
                            ButtonClass="mfg-danger"
                          >
                            X
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </>
              </Flex>
              {data &&
                data.map((item: any) => {
                  return (
                    <Flex FlexWidth="col-4" key={item.id}>
                      <Card
                        cardHeading={item.name}
                        CardImagePath={item.image}
                        CardImageAlt={item.name}
                        cardFooterChildren={
                          <Button
                            ButtonClass="mfg-plain"
                            link={`/single/${item.id}`}
                          >
                            Learn More
                          </Button>
                        }
                      />
                    </Flex>
                  );
                })}
            </FlexWrap>
          </Wrapper>
        </ErrorBoundary>
      </Suspense>
    </main>
  );
}
