from bs4 import BeautifulSoup
import requests
import urllib
import pandas as pd
import os
import pymongo


count = 0

df_dc = pd.DataFrame(columns=["review_ratings", "review_date", "review_text"])
f = open("washington.json", "w+")


for i in range(0,440,20):
    if (i==0):
        url = "https://www.yelp.com/biz/capital-bikeshare-washington"
    else:
        url = "https://www.yelp.com/biz/capital-bikeshare-washington" + f"?start={i}"

    response = requests.get(url)
    bike_resp = BeautifulSoup(response.text, 'html.parser')
    
    for item in bike_resp.find_all('div', class_='review-list'):
        try:
            review_ul_list_item =  item.find("ul", class_="ylist ylist-bordered reviews")
            
            for li_item in review_ul_list_item.find_all("li"):
                if li_item.find("div", "review review--with-sidebar") is not None :
                    li_main_ind_item = li_item.find("div", "review review--with-sidebar")
                    review_item = li_main_ind_item.find("div","review-content").div.div.div["title"]
                    review_date = li_main_ind_item.find("div","review-content").div.span.text.replace("Updated review", "").strip()
                    review_text = li_main_ind_item.find("div","review-content").p.text
                    count = count + 1

                    #print(f"'star_rating': {review_item} , 'review_date': {review_date}, 'review_text': {review_text}")
                    f.write(f"{{'star_rating': {review_item} , 'review_date': {review_date}, 'review_text': {review_text} }}\r\n")
                    # print(f"review_count -- {count}")
                    # print(f"star_rating -- {review_item}")
                    # print(f"review_date -- {review_date}")
                    # print(f"review_text -- {review_text}")

                    rating = review_item.replace(" star rating", "")

                    df_dc.loc[count,"review_ratings"] = rating
                    df_dc.loc[count,"review_date"] = review_date
                    df_dc.loc[count,"review_text"]= review_text


        except Exception as e:
            print(e)

f.close()

df_dc.to_excel("washington_yelp_review.xlsx")