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
import { use, Suspense, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";


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
                      <a key={ item.id} href={`/single/${item.id}`}>
                        <Card
                          key={item.id}
                          cardHeading={item.name}
                          CardImagePath={item.image}
                          CardImageAlt={item.name}
                          CardView="mfg-list"
                      />
                        </a>
                    );
                  })}
                </Search>
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
