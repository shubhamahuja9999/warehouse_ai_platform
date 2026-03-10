def slotting_recommendation(order_df):

    freq = order_df["sku"].value_counts().reset_index()
    freq = freq.rename(columns={"sku": "sku", "count": "picks"})

    def zone(picks):

        if picks > 500:
            return "Zone A (Near Packing)"

        elif picks > 200:
            return "Zone B"

        else:
            return "Zone C"

    freq["recommended_zone"] = freq["picks"].apply(zone)

    return freq